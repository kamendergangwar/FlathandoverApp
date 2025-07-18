import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Plus, CreditCard as Edit3, Trash2, FileText, Upload, Camera, X, Check, TriangleAlert as AlertTriangle, ChevronDown, ChevronUp, CircleHelp as HelpCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface CapturedImage {
  uri: string;
  name: string;
  type: string;
}

export default function SnaggingReportScreen() {
  const { applicationId } = useLocalSearchParams();
  const router = useRouter();
  const { 
    currentFlat, 
    snaggingNotes, 
    addSnaggingNote, 
    editSnaggingNote, 
    deleteSnaggingNote,
    signedSnaggingReport,
    signedInventoryReport,
    setSignedSnaggingReport,
    setSignedInventoryReport,
    submitReport,
    t 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showDocumentOptions, setShowDocumentOptions] = useState<'snagging' | 'inventory' | null>(null);

  const categories = [
    { id: 'electrical', name: t('electrical'), icon: '⚡', color: '#f59e0b' },
    { id: 'plumbing', name: t('plumbing'), icon: '🚿', color: '#3b82f6' },
    { id: 'doors_windows', name: t('doors_windows'), icon: '🚪', color: '#8b5cf6' },
    { id: 'walls_flooring', name: t('walls_flooring'), icon: '🧱', color: '#ef4444' },
    { id: 'kitchen_bathroom', name: t('kitchen_bathroom'), icon: '🏠', color: '#10b981' },
  ];

  if (!currentFlat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No flat selected</Text>
      </SafeAreaView>
    );
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddNote = () => {
    if (!selectedCategory || !noteText.trim()) {
      Alert.alert('Missing Information', 'Please select a category and enter a note.');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      category: categories.find(c => c.id === selectedCategory)?.name || selectedCategory,
      note: noteText.trim(),
      timestamp: new Date().toISOString(),
    };

    addSnaggingNote(newNote);
    setShowAddModal(false);
    setSelectedCategory('');
    setNoteText('');
  };

  const handleEditNote = (noteId: string) => {
    const note = snaggingNotes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setNoteText(note.note);
      const category = categories.find(c => c.name === note.category);
      setSelectedCategory(category?.id || '');
      setShowAddModal(true);
    }
  };

  const handleUpdateNote = () => {
    if (!editingNote || !selectedCategory || !noteText.trim()) {
      Alert.alert('Missing Information', 'Please select a category and enter a note.');
      return;
    }

    editSnaggingNote(editingNote, {
      category: categories.find(c => c.id === selectedCategory)?.name || selectedCategory,
      note: noteText.trim(),
    });

    setShowAddModal(false);
    setEditingNote(null);
    setSelectedCategory('');
    setNoteText('');
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSnaggingNote(noteId) }
      ]
    );
  };

  const handleDocumentCapture = async (type: 'snagging' | 'inventory') => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to capture documents.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const file = {
          uri: result.assets[0].uri,
          name: `${type}_report_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };

        if (type === 'snagging') {
          setSignedSnaggingReport(file);
        } else {
          setSignedInventoryReport(file);
        }

        setShowDocumentOptions(null);
        Alert.alert('Success', t('file_uploaded').replace('{name}', file.name));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture document. Please try again.');
    }
  };

  const handleDocumentUpload = async (type: 'snagging' | 'inventory') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name || `${type}_report.pdf`,
          type: result.assets[0].mimeType || 'application/pdf',
        };

        if (type === 'snagging') {
          setSignedSnaggingReport(file);
        } else {
          setSignedInventoryReport(file);
        }

        setShowDocumentOptions(null);
        Alert.alert('Success', t('file_uploaded').replace('{name}', file.name));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const handleImageCapture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to capture images.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage: CapturedImage = {
          uri: result.assets[0].uri,
          name: `snagging_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        setCapturedImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const handleImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is required to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage: CapturedImage = {
          uri: result.assets[0].uri,
          name: `snagging_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        setCapturedImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleSubmitReport = async () => {
    if (!signedSnaggingReport || !signedInventoryReport) {
      Alert.alert('Missing Documents', t('upload_required'));
      return;
    }

    setIsSubmitting(true);

    const report = {
      applicationNo: currentFlat.applicationNo,
      flatNo: currentFlat.flatNo,
      applicantName: currentFlat.applicantName,
      notes: snaggingNotes,
      images: capturedImages,
      submittedAt: new Date().toISOString(),
    };

    try {
      const success = await submitReport(report, signedSnaggingReport, signedInventoryReport);
      
      if (success) {
        router.push(`/signature/${applicationId}`);
      } else {
        Alert.alert('Error', 'Failed to submit report. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryNotes = (categoryName: string) => {
    return snaggingNotes.filter(note => note.category === categoryName);
  };

  const renderInstructionsModal = () => (
    <Modal
      visible={showInstructionsModal}
      animationType="fade"
      transparent
    >
      <View style={styles.instructionsModalContainer}>
        <TouchableOpacity 
          style={styles.instructionsModalOverlay}
          onPress={() => setShowInstructionsModal(false)}
        />
        <View style={styles.instructionsModalContent}>
          <View style={styles.instructionsModalHeader}>
            <View style={styles.instructionsModalTitleContainer}>
              <AlertTriangle size={24} color="#f59e0b" />
              <Text style={styles.instructionsModalTitle}>{t('instructions')}</Text>
            </View>
            <TouchableOpacity
              style={styles.instructionsModalClose}
              onPress={() => setShowInstructionsModal(false)}
            >
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.instructionsModalText}>
            {t('snagging_instructions_text')}
          </Text>
          <View style={styles.instructionsSteps}>
            <Text style={styles.instructionsStepTitle}>Steps to follow:</Text>
            <Text style={styles.instructionsStep}>1. Inspect each area thoroughly</Text>
            <Text style={styles.instructionsStep}>2. Document issues with photos</Text>
            <Text style={styles.instructionsStep}>3. Add detailed notes for each problem</Text>
            <Text style={styles.instructionsStep}>4. Upload signed reports</Text>
            <Text style={styles.instructionsStep}>5. Submit the complete report</Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDocumentOptionsModal = () => (
    <Modal
      visible={showDocumentOptions !== null}
      animationType="slide"
      transparent
    >
      <View style={styles.documentOptionsContainer}>
        <TouchableOpacity 
          style={styles.documentOptionsOverlay}
          onPress={() => setShowDocumentOptions(null)}
        />
        <View style={styles.documentOptionsContent}>
          <View style={styles.documentOptionsHeader}>
            <Text style={styles.documentOptionsTitle}>
              {showDocumentOptions === 'snagging' ? 'Snagging Report' : 'Inventory Report'}
            </Text>
            <TouchableOpacity onPress={() => setShowDocumentOptions(null)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.documentOptionsButtons}>
            <TouchableOpacity
              style={styles.documentOptionButton}
              onPress={() => showDocumentOptions && handleDocumentCapture(showDocumentOptions)}
            >
              <Camera size={24} color="#2563eb" />
              <Text style={styles.documentOptionText}>Capture with Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.documentOptionButton}
              onPress={() => showDocumentOptions && handleDocumentUpload(showDocumentOptions)}
            >
              <Upload size={24} color="#2563eb" />
              <Text style={styles.documentOptionText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAddNoteModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => {
            setShowAddModal(false);
            setEditingNote(null);
            setSelectedCategory('');
            setNoteText('');
          }}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editingNote ? 'Edit Note' : t('add_note')}
          </Text>
          <TouchableOpacity 
            onPress={editingNote ? handleUpdateNote : handleAddNote}
            disabled={!selectedCategory || !noteText.trim()}
          >
            <Check size={24} color={selectedCategory && noteText.trim() ? '#059669' : '#d1d5db'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalSectionTitle}>{t('select_category')}</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && { 
                    backgroundColor: category.color,
                    borderColor: category.color 
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.modalSectionTitle}>Note Details</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={t('add_note_placeholder')}
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            value={noteText}
            onChangeText={setNoteText}
            textAlignVertical="top"
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderImageModal = () => (
    <Modal
      visible={showImageModal}
      animationType="fade"
      transparent
    >
      <View style={styles.imageModalContainer}>
        <TouchableOpacity 
          style={styles.imageModalOverlay}
          onPress={() => setShowImageModal(false)}
        />
        <View style={styles.imageModalContent}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setShowImageModal(false)}
          >
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#2563eb']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('snagging_report')}</Text>
          <Text style={styles.headerSubtitle}>{currentFlat.flatNo} - {currentFlat.applicantName}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <FileText size={24} color="#2563eb" />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>{t('snagging_summary')}</Text>
              <Text style={styles.summarySubtitle}>
                {t('total_notes').replace('{count}', snaggingNotes.length.toString())}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => setShowInstructionsModal(true)}
            >
              <HelpCircle size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Inspection Categories</Text>
          {categories.map((category) => {
            const categoryNotes = getCategoryNotes(category.name);
            const isExpanded = expandedCategories.has(category.id);
            
            return (
              <View key={category.id} style={styles.categorySection}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View style={styles.categoryTitleContainer}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryTitle}>{category.name}</Text>
                    <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                      <Text style={styles.categoryBadgeText}>{categoryNotes.length}</Text>
                    </View>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={20} color="#6b7280" />
                  ) : (
                    <ChevronDown size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.categoryNotesContainer}>
                    {categoryNotes.length === 0 ? (
                      <View style={styles.emptyNotesContainer}>
                        <Text style={styles.emptyNotesText}>No issues found in this category</Text>
                      </View>
                    ) : (
                      categoryNotes.map((note) => (
                        <View key={note.id} style={styles.noteCard}>
                          <View style={styles.noteContent}>
                            <Text style={styles.noteText}>{note.note}</Text>
                            <Text style={styles.noteTimestamp}>
                              {new Date(note.timestamp).toLocaleString()}
                            </Text>
                          </View>
                          <View style={styles.noteActions}>
                            <TouchableOpacity
                              style={styles.noteActionButton}
                              onPress={() => handleEditNote(note.id)}
                            >
                              <Edit3 size={16} color="#6b7280" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.noteActionButton}
                              onPress={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 size={16} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>Photo Documentation</Text>
          
          <View style={styles.mediaActions}>
            <TouchableOpacity style={styles.mediaButton} onPress={handleImageCapture}>
              <Camera size={20} color="#2563eb" />
              <Text style={styles.mediaButtonText}>Capture Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton} onPress={handleImageFromGallery}>
              <Upload size={20} color="#2563eb" />
              <Text style={styles.mediaButtonText}>From Gallery</Text>
            </TouchableOpacity>
          </View>

          {capturedImages.length > 0 && (
            <View style={styles.imageGrid}>
              {capturedImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageThumb}
                  onPress={() => {
                    setSelectedImage(image.uri);
                    setShowImageModal(true);
                  }}
                >
                  <Image source={{ uri: image.uri }} style={styles.thumbImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setCapturedImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    <X size={16} color="#ffffff" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.uploadsSection}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          
          <View style={styles.uploadCard}>
            <View style={styles.uploadHeader}>
              <FileText size={20} color="#2563eb" />
              <Text style={styles.uploadTitle}>{t('upload_snagging_report')}</Text>
            </View>
            {signedSnaggingReport ? (
              <View style={styles.uploadedFile}>
                <Check size={16} color="#059669" />
                <Text style={styles.uploadedFileName}>{signedSnaggingReport.name}</Text>
                <TouchableOpacity
                  style={styles.replaceButton}
                  onPress={() => setShowDocumentOptions('snagging')}
                >
                  <Text style={styles.replaceButtonText}>Replace</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => setShowDocumentOptions('snagging')}
              >
                <Upload size={16} color="#2563eb" />
                <Text style={styles.uploadButtonText}>Add Document</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.uploadCard}>
            <View style={styles.uploadHeader}>
              <FileText size={20} color="#2563eb" />
              <Text style={styles.uploadTitle}>{t('upload_inventory_report')}</Text>
            </View>
            {signedInventoryReport ? (
              <View style={styles.uploadedFile}>
                <Check size={16} color="#059669" />
                <Text style={styles.uploadedFileName}>{signedInventoryReport.name}</Text>
                <TouchableOpacity
                  style={styles.replaceButton}
                  onPress={() => setShowDocumentOptions('inventory')}
                >
                  <Text style={styles.replaceButtonText}>Replace</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => setShowDocumentOptions('inventory')}
              >
                <Upload size={16} color="#2563eb" />
                <Text style={styles.uploadButtonText}>Add Document</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>{t('add_note')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!signedSnaggingReport || !signedInventoryReport || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitReport}
            disabled={!signedSnaggingReport || !signedInventoryReport || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : t('submit_report')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderInstructionsModal()}
      {renderDocumentOptionsModal()}
      {renderAddNoteModal()}
      {renderImageModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  summarySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  helpButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  categorySection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  categoryNotesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyNotesContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  emptyNotesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  noteCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    lineHeight: 20,
    marginBottom: 4,
  },
  noteTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  noteActions: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  noteActionButton: {
    padding: 6,
    marginLeft: 4,
  },
  mediaSection: {
    marginBottom: 24,
  },
  mediaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mediaButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mediaButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
    marginLeft: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadsSection: {
    marginBottom: 24,
  },
  uploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  uploadButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563eb',
    marginLeft: 8,
  },
  uploadedFile: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadedFileName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginLeft: 8,
    flex: 1,
  },
  replaceButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  replaceButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  actionContainer: {
    paddingBottom: 24,
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  // Instructions Modal Styles
  instructionsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  instructionsModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  instructionsModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  instructionsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionsModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionsModalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  instructionsModalClose: {
    padding: 4,
  },
  instructionsModalText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  instructionsSteps: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
  },
  instructionsStepTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  instructionsStep: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  // Document Options Modal Styles
  documentOptionsContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  documentOptionsOverlay: {
    flex: 1,
  },
  documentOptionsContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  documentOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  documentOptionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  documentOptionsButtons: {
    gap: 12,
  },
  documentOptionButton: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  documentOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  categoryNameSelected: {
    color: '#ffffff',
  },
  noteInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlignVertical: 'top',
  },
  // Image Modal Styles
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageModalContent: {
    width: '90%',
    height: '80%',
    position: 'relative',
  },
  imageModalClose: {
    position: 'absolute',
    top: -40,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});